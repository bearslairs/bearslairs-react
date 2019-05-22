import React from 'react';
import yellowLockers from './img/lockers.png';
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

function App() {
  return (
    <Container>
      <Row style={{ paddingTop: '10px' }}>
        <Carousel>
          <Carousel.Item>
            <Image src={yellowLockers} alt="first slide" fluid rounded />
            <Carousel.Caption>
              <Localized id="carousel-papa-bear-header">
                <h3>papa bear lockers</h3>
              </Localized>
              <p>big enough for big bikes and large tool collections</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <Image src={blueLockers} alt="second slide" fluid rounded />
            <Carousel.Caption>
              <h3>baby bear lockers</h3>
              <p>skis, snowboards, boots and all your heavy winter gear</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </Row>
      <Row style={{ paddingTop: '10px' }}>
        <Card style={{ width: '30%', marginRight: '10px' }}>
          <Card.Img variant="top" src={motorcycle} fluid rounded />
          <Card.Body>
            <Card.Title>papa bear locker</Card.Title>
            <Button variant="primary" className="float-right">book now</Button>
            <Card.Text>
              our largest locker.<br />
              big enough for a quad bike and tool shop.
            </Card.Text>
            <ul>
              <li>
                locker dimensions:
                <ul>
                  <li>3 metres deep</li>
                  <li>2 metres wide</li>
                  <li>2.4 metres high</li>
                </ul>
              </li>
              <li>
                door dimensions:
                <ul>
                  <li>width of 1.8 metres</li>
                  <li>height of 2 metres</li>
                </ul>
              </li>
              <li>
                security:
                <ul>
                  <li>external cctv recording</li>
                  <li>heavy duty, secure lock clasp</li>
                </ul>
              </li>
              <li>
                typical use:
                <ul>
                  <li>motorcycles or quadbike garage with battery left on a powered trickle charge</li>
                  <li>tools and workshop equipment</li>
                  <li>large furniture items</li>
                </ul>
              </li>
              <li>
                facilities:
                <ul>
                  <li>internal led lighting</li>
                  <li>electric power socket</li>
                </ul>
              </li>
            </ul>
          </Card.Body>
        </Card>
        <Card style={{ width: '30%', marginRight: '10px' }}>
          <Card.Img variant="top" src={cube} fluid rounded />
          <Card.Body>
            <Card.Title>mama bear locker</Card.Title>
            <Button variant="primary" className="float-right">book now</Button>
            <Card.Text>
              space for bicycles, boxes, small furniture and luggage
            </Card.Text>
            <ul>
              <li>
                locker dimensions:
                <ul>
                  <li>2 metres deep</li>
                  <li>1 metre wide</li>
                  <li>2.4 metres high</li>
                </ul>
              </li>
              <li>
                door dimensions:
                <ul>
                  <li>width of 0.9 metres</li>
                  <li>height of 2 metres</li>
                </ul>
              </li>
              <li>
                security:
                <ul>
                  <li>external cctv recording</li>
                  <li>secure lock clasp</li>
                </ul>
              </li>
              <li>
                typical use:
                <ul>
                  <li>bicycles and exercise equipment</li>
                  <li>tools and workshop equipment</li>
                  <li>small furniture items</li>
                  <li>large luggage, boxes or crates</li>
                  <li>tools and equipment</li>
                </ul>
              </li>
              <li>
                facilities:
                <ul>
                  <li>internal led lighting</li>
                </ul>
              </li>
            </ul>
          </Card.Body>
        </Card>
        <Card style={{ width: '30%' }}>
          <Card.Img variant="top" src={ski} fluid rounded />
          <Card.Body>
            <Card.Title>baby bear locker</Card.Title>
            <Button variant="primary" className="float-right">book now</Button>
            <Card.Text>
              a secure place for skis, snowboards, winter gear and boots
            </Card.Text>
            <ul>
              <li>
                locker dimensions:
                <ul>
                  <li>0.5 metres deep</li>
                  <li>0.5 metres wide</li>
                  <li>2 metres high</li>
                </ul>
              </li>
              <li>
                door dimensions:
                <ul>
                  <li>width of 0.4 metres</li>
                  <li>height of 1.8 metres</li>
                </ul>
              </li>
              <li>
                security:
                <ul>
                  <li>external cctv recording</li>
                  <li>secure lock clasp</li>
                </ul>
              </li>
              <li>
                typical use:
                <ul>
                  <li>skis and snowboards</li>
                  <li>bulky ski clothing & winter gear</li>
                  <li>ski & snowboard boots</li>
                  <li>small luggage items</li>
                  <li>books</li>
                  <li>small electronic items</li>
                  <li>tools and equipment</li>
                </ul>
              </li>
            </ul>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
}

export default App;
