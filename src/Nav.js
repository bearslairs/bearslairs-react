import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Button from 'react-bootstrap/Button';
import Cookies from 'universal-cookie';
import * as qs from 'query-string';


const querystring = qs.parse(window.location.search);
const cookies = new Cookies();
const CopyApi = 'https://raw.githubusercontent.com/bearslairs/bearslairs-data/master/copy';
const languages = ['bg', 'en', 'ru'];

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: 'en',
      copy: {
        title: '',
        subtitle: '',
        languages: []
      }
    };
  }

  componentDidMount() {
    let language = languages.includes(querystring.lang) // if the querystring lang is set, use that
      ? querystring.lang
      : languages.includes(cookies.get('lang')) // else if the cookies contain a lang, use that
        ? cookies.get('lang')
        : this.state.language; // fall back to a default
    this.setState(prevState => ({
      language: language,
      copy: prevState.copy
    }));
    cookies.set('lang', language, { path: '/' });
    fetch(CopyApi + '/' + language + '/nav.json')
    .then(responseCopyApi => responseCopyApi.json())
    .then((copy) => {
      this.setState(prevState => ({
        language: prevState.language,
        copy: copy
      }));
    })
    .catch(console.log);
  }
  render() {
    return (
      <header className="App-header clearfix">
        <LinkContainer to="/">
          <div>
            <img src="favicon-32x32.png" alt="bears lairs logo" style={{marginRight: '6px'}} className="float-left rounded-circle" />
            <h1 className="float-left">{this.state.copy.title}</h1>
          </div>
        </LinkContainer>
        <h2 className="float-left text-muted">{this.state.copy.subtitle}</h2>
        <LinkContainer to="/book">
          <Button className="float-right">book</Button>
        </LinkContainer>
        <span className="float-right text-muted">
          {
            this.state.copy.languages.map(lang => (
              <a key={lang} href={'?lang=' + lang} className="text-muted">{lang}</a>
            ))
          }
        </span>
      </header>
    );
  }
}

export default Nav;