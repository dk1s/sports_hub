import React from 'react'
import { FaRedoAlt, FaHome } from 'react-icons/fa'
import { Link } from 'react-router-dom'

/**
 * ErrorBoundary — catches uncaught render/lifecycle errors anywhere below it
 * and shows a professional fallback instead of a blank white screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Surface to the console for debugging; in production you'd report to an error tracker.
    console.error('[SportsHub ErrorBoundary]', error, info?.componentStack)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-brand-950 px-6 text-center">
        <p className="eyebrow !text-accent">Unexpected error</p>
        <h1 className="mt-2 max-w-xl font-display text-3xl font-bold text-white">
          We hit a boundary on this play.
        </h1>
        <p className="mt-3 max-w-md text-sm text-white/60">
          Something went wrong while rendering this page. Your data is safe — reload to get back into the game.
        </p>
        {this.state.error?.message && (
          <code className="mt-4 max-w-md truncate rounded-lg bg-white/10 px-3 py-2 text-xs text-white/50">
            {this.state.error.message}
          </code>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={this.reset} className="btn bg-accent text-white hover:bg-accent-600">
            <FaRedoAlt /> Try again
          </button>
          <Link to="/" onClick={this.reset} className="btn border border-white/20 bg-white/5 text-white hover:bg-white/10">
            <FaHome /> Back to home
          </Link>
        </div>
      </div>
    )
  }
}