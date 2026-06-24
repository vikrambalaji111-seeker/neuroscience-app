import { Component } from 'react'

// Catches render errors anywhere below it so a single bad state can't blank the
// whole app. Shows a recoverable fallback instead.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  reset = () => {
    this.setState({ error: null })
    if (window.location.hash !== '#/') window.location.hash = '#/'
  }

  render() {
    if (this.state.error) {
      return (
        <div className="content">
          <div className="category-view">
            <h1>Something went wrong</h1>
            <p className="category-blurb">
              The page hit an unexpected error. Your data is safe — nothing was
              changed.
            </p>
            <button className="summarize-btn" onClick={this.reset}>
              Return home
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
