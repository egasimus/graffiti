import * as React from 'react'
import { FlatListProps } from '../react-native-types'
import { ScrollView } from '..'

const noopSeparators = {
  highlight: (): void => {},
  unhighlight: (): void => {},
  updateProps: (): void => {}
}

export function FlatList<TItem>(props: FlatListProps<TItem>) {
  const { data, renderItem, style, ItemSeparatorComponent } = props
  return (
    <ScrollView style={style}>
      {data && data.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem({ item, index, separators: noopSeparators })}
          {ItemSeparatorComponent && index !== data.length - 1 ? (
            <ItemSeparatorComponent />
          ) : null}
        </React.Fragment>
      ))}
    </ScrollView>
  )
}

export default FlatList
