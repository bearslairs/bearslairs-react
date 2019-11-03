import React, { Component } from 'react'
import mamaBear from './img/mama-bear-icon.png';
import blueLockers from './img/blue-lockers.png';
import motorcycle from './img/motorcycle-storage.png';
import cube from './img/cube-storage.png';
import ski from './img/ski-storage.png';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import { Localized } from 'fluent-react/compat';
import './App.css';

const CopyApi = 'https://raw.githubusercontent.com/bearslairs/bearslairs-data/master/copy';

class App extends Component {
  state = {
    language: 'en',
    copy: {
      carousel: [],
      cards: []
    }
  };
  componentDidMount() {
    fetch(CopyApi + '/' + this.state.language + '/home.json')
    .then(responseCopyApi => responseCopyApi.json())
    .then((copy) => {
      this.setState(currentState => ({
        language: currentState.language,
        copy: copy
      }));
    })
    .catch(console.log);
  }
  render() {
    return (
      <Container>
        <header className="App-header clearfix">
          <h1 className="float-left">bears lairs</h1>
          <h2 className="float-left text-muted">secure, self-storage in bansko with 24/7 access</h2>
          <span className="float-right text-muted">
            <a href="" className="text-muted">bg</a>
            <a href="">en</a>
            <a href="" className="text-muted">ru</a>
          </span>
        </header>
        <Row style={{ paddingTop: '10px' }}>
          <Carousel>
            {
              this.state.copy.carousel.map((carouselItem) => (
                <Carousel.Item>
                  <Image src={carouselItem.image.url} alt={carouselItem.image.alt} fluid rounded />
                  <Carousel.Caption>
                    <Localized id="carousel-papa-bear-header">
                      <h3>{carouselItem.title}</h3>
                    </Localized>
                    <p>{carouselItem.description}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))
            }
          </Carousel>
        </Row>
        <Row style={{ paddingTop: '10px' }}>
          {
            this.state.copy.cards.map((card) => (
              <Card style={{ width: '30%', marginRight: '10px' }}>
                <Card.Header as="h3">
                  {card.title}
                  <Image src={card.icon.url} alt={card.icon.alt} fluid rounded style={{ marginRight: '10px' }} className="float-right" />
                </Card.Header>
                <Card.Img variant="top" src={card.image.url} alt={card.image.alt} fluid rounded />
                <Card.Body>
                  <Card.Title>
                    {card.description.join(' ')}
                  </Card.Title>
                  <hr />
                  <Card.Text>
                    <ul>
                      {
                        card.features.map((feature) => (
                          <li>
                            {feature.text}
                            <ul>
                              {
                                feature.details.map((detail) => (
                                  <li>{detail}</li>
                                ))
                              }
                            </ul>
                          </li>
                        ))
                      }
                    </ul>
                    <Button variant="primary" className="float-right">{card.button.text}</Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          }
        </Row>
      </Container>
    );
  }
}

export default App;
