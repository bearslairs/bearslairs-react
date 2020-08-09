import React, { Component } from 'react';
import { HashLink } from 'react-router-hash-link';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: (props.language || 'en'),
      links: [
        {
          href: '/#container-about',
          text: {
            'bg': 'about',
            'en': 'about',
            'ru': 'about'
          }
        },
        {
          href: '/#container-map',
          text: {
            'bg': 'location',
            'en': 'location',
            'ru': 'location'
          }
        },
        {
          href: '/book',
          text: {
            'bg': 'book now',
            'en': 'book now',
            'ru': 'book now'
          }
        }
      ]
    };
  }

  render() {
    return (
      <Navbar id="container-nav">
        <Nav className="m-auto">
          {
            this.state.links.map(link => (
                (link.text['en'].startsWith('book'))
                  ? (
                      <HashLink to={link.href} key={link.href} className="btn">
                        {link.text[this.state.language]}
                      </HashLink>
                    )
                  : (
                      <Nav.Link href={link.href} key={link.href}>
                        {link.text[this.state.language]}
                      </Nav.Link>
                    )
            ))
          }
        </Nav>
      </Navbar>
    );
  }
}

export default Navigation;