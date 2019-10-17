import React from 'react'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import Container from '../../components/Container'
import styled from 'styled-components/native'

const View = styled.View``
const Text = styled.Text``

class PhotosListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Your Photos'
    }
  }

  render () {
    const { navigation, photos } = this.props
    console.log('photos', photos)
    const headerActions = [
      {
        name: 'upload-2',
        onPress: () => { console.log('upload') }
      },
      {
        name: 'trash-bin',
        onPress: () => { console.log('trash') }
      }
    ]
    return (
      <Container>
        <Header
          navigation={navigation}
          actions={headerActions}
        />
        <View>
          <Text>Photos List</Text>
        </View>

      </Container>
    )
  }
}

const mapStateToProps = state => ({
  photos: state.photos
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(PhotosListScreen)
