import React from 'react'
import { ScrollView, Platform } from 'react-native'
import { DrawerItems, SafeAreaView } from 'react-navigation'
import styled from 'styled-components/native'
import { colors } from '../style/variables'

const HeaderWrapper = styled.View`
  height: 144;
  background-color: ${colors.primary};
  padding-top: ${Platform.OS === 'ios' ? 50 : 30}
  flex: 1;
  flex-direction: row;
  align-items: center;
`

const Logo = styled.Image`
  width: 64;
  height: 64;
`

const LogoName = styled.Text`
  font-weight: 900;
  letter-spacing: 0.15;
  font-size: 24;
  color: white;
`

export default function Drawer (props) {
  const { items } = props

  const topnav = items.filter((item) => {
    return ['Explore', 'OfflineMaps', 'UserContributions'].includes(item.key)
  })

  const bottomnav = items.filter((item) => {
    return ['About', 'Account', 'Settings'].includes(item.key)
  })

  return (
    <ScrollView>
      <HeaderWrapper>
        <Logo source={{ uri: 'observe_logo' }} />
        <LogoName>OBSERVE</LogoName>
      </HeaderWrapper>
      <SafeAreaView style={{ flex: 1, borderBottomWidth: 0.5, borderBottomColor: '#eee' }} forceInset={{ top: 'always', horizontal: 'never' }}>
        <DrawerItems {...Object.assign({}, props, { items: topnav })} />
      </SafeAreaView>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
        <DrawerItems {...Object.assign({}, props, { items: bottomnav })} />
      </SafeAreaView>
    </ScrollView>
  )
}
