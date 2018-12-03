import * as yoga from 'yoga-layout'
import { remove } from './utils'

// base node with layout and children
// - appendChild/insertBefore/removeChild/update() is needed for all react "instances"
// - and we need yogaNode and write() for anything what can be root
abstract class Base<T> {
  yogaNode = yoga.Node.create()
  children: T[] = []

  insertAt(c, index) {
    this.children.splice(index, 0, c)
  }

  removeChild(c) {
    remove(this.children, c)
  }

  appendChild(c) {
    this.insertAt(c, this.children.length)
  }

  insertBefore(c, before) {
    const index = this.children.indexOf(before)

    this.insertAt(index, c)
  }

  getLayout(parentLeft, parentTop) {
    const { left, top, width, height } = this.yogaNode.getComputedLayout()
    return [parentLeft + left, parentTop + top, width, height]
  }

  abstract update(props, window)
  abstract write(bucketIds, layouts, x, y)
}

export class View extends Base<View | Text> {
  backgroundBucketId
  borderBucketId

  insertAt(c, index) {
    super.insertAt(c, index)
    this.yogaNode.insertChild(c.yogaNode, index)
  }

  removeChild(c) {
    remove(this.children, c)
    this.yogaNode.removeChild(c.yogaNode)
  }

  update({ layout, background, border }, window) {
    updateYogaNode(this.yogaNode, layout)

    this.backgroundBucketId = window._setBucket(this.backgroundBucketId, background)
    this.borderBucketId = window._setBucket(this.borderBucketId, border)
  }

  write(bucketIds, layouts, x, y) {
    const layout = this.getLayout(x, y)

    if (this.backgroundBucketId !== undefined) {
      bucketIds.push(this.backgroundBucketId)
      layouts.push(layout)
    }

    if (this.borderBucketId !== undefined) {
      bucketIds.push(this.borderBucketId)
      layouts.push(layout)
    }

    this.children.forEach(c => c.write(bucketIds, layouts, layout[0], layout[1]))
  }
}

export class Text extends Base<TextNode> {
  fontInstanceKey
  color
  bucketId
  glyphs = []
  width

  constructor(private window) {
    super()

    this.yogaNode.setMeasureFunc(() => {
      this.updateGlyphs()

      return { width: this.width, height: 30 }
    })
  }

  insertAt(c, index) {
    super.insertAt(c, index)
    c.text = this
    this.yogaNode.markDirty()
  }

  removeChild(c) {
    super.appendChild(c)
    c.text = undefined
    this.yogaNode.markDirty()
  }

  update({ fontInstanceKey = [1, 2], color }, window) {
    this.fontInstanceKey = fontInstanceKey
    this.color = color

    this.updateBucket()
  }

  updateBucket() {
    this.bucketId = this.window._setBucket(this.bucketId, {
      Text: [{
        font_key: this.fontInstanceKey,
        color: this.color
      }, this.glyphs]
    })
  }

  updateGlyphs() {
    const wholeStr = this.children.map(c => c.value).join('')
    const glyphInfos = this.window.getGlyphInfos(wholeStr)

    const glyphs = []

    let x = 0
    const y = 20

    const len = glyphInfos.length
    for (let i = 0; i < len; i += 2) {
      const glyphIndex = glyphInfos[i]
      const advance = glyphInfos[i + 1]

      glyphs.push([glyphIndex, [x, y]])

      x += advance
    }

    this.glyphs = glyphs
    this.width = x

    this.updateBucket()
  }

  write(bucketIds, layouts, x, y) {
    const layout = this.getLayout(x, y)

    bucketIds.push(this.window._consts.TEXT_STACKING_CONTEXT)
    layouts.push(layout)

    bucketIds.push(this.bucketId)
    layouts.push([0, 0, layout[2], layout[3]])

    bucketIds.push(this.window._consts.POP_STACKING_CONTEXT)
    layouts.push([0, 0, 0, 0])
  }
}

export class TextNode {
  value
  text

  constructor(value) {
    this.setValue(value)
  }

  setValue(value) {
    this.value = value

    if (this.text !== undefined) {
      this.text.yogaNode.markDirty()
    }
  }
}


// TODO: should be in the same "land" with yoga so there is no hopping back and forth)
// takes array of numbers
function updateYogaNode(n: yoga.YogaNode, values) {
  let i = 0
  const v = values

  n.setWidth(v[i++])
  n.setHeight(v[i++])
  n.setFlexDirection(v[i++])
  n.setFlex(v[i++])
  // n.setFlexGrow(v[i++])
  // n.setFlexShrink(v[i++])

  n.setMargin(yoga.EDGE_TOP, v[i++])
  n.setMargin(yoga.EDGE_RIGHT, v[i++])
  n.setMargin(yoga.EDGE_BOTTOM, v[i++])
  n.setMargin(yoga.EDGE_LEFT, v[i++])

  n.setPadding(yoga.EDGE_TOP, v[i++])
  n.setPadding(yoga.EDGE_RIGHT, v[i++])
  n.setPadding(yoga.EDGE_BOTTOM, v[i++])
  n.setPadding(yoga.EDGE_LEFT, v[i++])

  n.setAlignContent(v[i++])
  n.setAlignItems(v[i++])
  n.setAlignSelf(v[i++])
  n.setJustifyContent(v[i++])
}