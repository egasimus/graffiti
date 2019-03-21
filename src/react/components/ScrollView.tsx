import * as React from 'react'
import { ScrollViewProps } from '../react-native-types'
import { View, StyleSheet } from '..'

// TODO
export const ScrollView: React.SFC<ScrollViewProps> = (props) => {
  return (
    <View style={[styles.scrollView, props.style]}>
      <View style={props.contentContainerStyle}>
        {props.children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    //overflow: '?'
  }
})
