import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

class Logo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: 'en'
    };
  }

  render() {
    return (
      <Container id="container-logo">
        <Row>
          <Image src={'/logo.png'} className="m-auto" />
        </Row>
      </Container>
    );
  }
}

export default Logo;
