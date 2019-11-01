import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { Dimensions, View, Keyboard } from 'react-native'
import { PhotoView, ImageDetails } from '../../components/PhotoView'

import Container from '../../components/Container'
import Header from '../../components/Header'
import PageWrapper from '../../components/PageWrapper'
import { colors } from '../../style/variables'

class PhotoDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Photo Details'
    }
  }

  render () {
    const { navigation } = this.props
    const photo = this.props.navigation.getParam('photo')
    console.log('photo', photo)

    const headerActions = [
      {
        name: 'pencil',
        onPress: () => {
          // navigation.navigate('', {})
        }
      },
      {
        name: 'trash-bin',
        onPress: () => {
          // this.setState({ dialogVisible: true })
        }
      }
    ]

    return (
      <Container>
        <Header back title='Photo Details' navigation={navigation} actions={headerActions} />
        <PageWrapper>
          <PhotoView path={photo.path} />
          <ImageDetails timestamp={photo.location.timestamp} location={photo.location} />
        </PageWrapper>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetailScreen)
