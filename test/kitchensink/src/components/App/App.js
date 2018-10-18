import React, { Component, createElement } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { feature: null };
  }

  componentDidMount() {
    const feature = window.location.hash.slice(1);

    switch (feature) {
      case 'css-inclusion':
        import('../CssInclusion/CssInclusion').then(f =>
          this.setState({ feature: f.default }),
        );
        break;
      case 'global-css-inclusion':
        import('../GlobalCssInclusion/GlobalCssInclusion').then(f =>
          this.setState({ feature: f.default }),
        );
        break;
      case 'json-inclusion':
        import('../JsonInclusion/JsonInclusion').then(f =>
          this.setState({ feature: f.default }),
        );
        break;
      default:
        throw new Error(`Missing feature "${feature}"`);
    }
  }

  render() {
    const { feature } = this.state;

    if (feature !== null) {
      return <div>{createElement(this.state.feature)}</div>;
    }

    return null;
  }
}

export default App;
