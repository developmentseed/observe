import React from 'react'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import Container from '../../components/Container'
import TracesList from '../../components/TracesList'

class TracesListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Your Traces'
    }
  }

  // select = trace => {
  //   const { navigation } = this.props
  //   navigation.navigate({ routeName: 'TraceDetailScreen', params: { trace: trace.id } })
  // }

  render () {
    const { navigation, traces } = this.props
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
          title='Your Traces'
          navigation={navigation}
          actions={headerActions}
        />
        <TracesList
          data={traces.traces}
          onSelectItem={this.select}
        />

      </Container>
    )
  }
}

const mapStateToProps = state => ({
  traces: state.traces
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(TracesListScreen)
