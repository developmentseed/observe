import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components/native'
import { Dimensions, View, Keyboard } from 'react-native'
import { PhotoView, ImageDetails } from '../../components/PhotoView'

import Container from '../../components/Container'
import Header from '../../components/Header'
import PageWrapper from '../../components/PageWrapper'
import { colors } from '../../style/variables'

const Text = styled.Text``
const PhotoDetails = styled.View`
  margin-top: 10;
  height: 80;
  border-bottom-width: 0.2;
  border-bottom-color: ${colors.muted}
`
const TimeText = styled.Text`
  font-size: 24;
  letter-spacing: 1;
`
const LocationText = styled.Text`
  color: ${colors.muted};
  padding-bottom: 5;
`

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
