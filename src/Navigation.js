import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: (props.language || 'en'),
      links: [
        {
          href: '/#about',
          text: {
            'bg': 'about',
            'en': 'about',
            'ru': 'about'
          }
        },
        {
          href: '/#prices',
          text: {
            'bg': 'prices',
            'en': 'prices',
            'ru': 'prices'
          }
        },
        {
          href: '/#location',
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
              <Nav.Link href={link.href}>
                {
                  link.text[this.state.language]
                }
              </Nav.Link>
            ))
          }
        </Nav>
      </Navbar>
    );
  }
}

export default Navigation;