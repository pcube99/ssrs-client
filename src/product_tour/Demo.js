import React from "react";
import Section from "./Section";
import { Button, Link } from "./Button";
import Scrollable from "./Scrollable";
import Box from "./Box";
import Heading from './Heading';
const Demo = ({ openTour}) => (
  <div>
   
    <Section center>
      <Button h="4" onClick={openTour}>
        Try it
      </Button>
      
    </Section>
      
      
    
  </div>
);

export default Demo;
