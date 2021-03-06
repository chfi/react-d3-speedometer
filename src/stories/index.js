import React, { Component } from 'react';
// import { storiesOf, action, setAddon } from '@kadira/storybook';
import { storiesOf, action, setAddon } from '@storybook/react';
import infoAddon, { setDefaults, withInfo } from '@storybook/addon-info';
// knobs for showing dynamic props
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import './styles.css';

// addon-info
setDefaults({
    inline: true,
    maxPropsIntoLine: 1,
    maxPropObjectKeys: 10,
    maxPropArrayLength: 10,
    maxPropStringLength: 100,
});

// set the info addon for storybook!
setAddon( infoAddon );

import ReactSpeedometer from '../index';
// NOTE: switch to dist for checking production version
// import ReactSpeedometer from '../../dist/index';

// a custom button with state to demonstrate force rendering
class SpeedoButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggleStatus: false,
            value: 111,
            startColor: 'blue',
            segments: 5,
            width: 300,
            height: 300
        };

        this.values = [
            {
                value: 111,
                startColor: 'blue',
                segments: 5,
                width: 300,
                height: 300
            },
            {
                value: 222,
                startColor: 'orange',
                segments: 10,
                width: 400,
                height: 400
            }
        ];
    };

    render() {
        return(
            <div>
                <h4>
                    Click the below button to force rerendering the whole component on props change.
                    By default, on props change, only the speedometer value/needle value will be updated and animated for smooth visualization.
                    Below button will toggle between two sets of totally different appearances, when forceRender option is given true.
                </h4>

                <button onClick={ () => {
                    // change the toggle status
                    this.setState({
                        toggleStatus: !this.state.toggleStatus
                    });
                    // now set the new set of values
                    let new_values = this.state.toggleStatus ? this.values[0] : this.values[1];
                    this.setState( new_values );
                } }>
                    <strong>Force Re render component on props change</strong>
                </button>
                <ReactSpeedometer
                    value={this.state.value}
                    startColor={this.state.startColor}
                    forceRender={true}
                    segments={this.state.segments}
                    width={this.state.width}
                    height={this.state.height}
                />

            </div>
        )
    }
}

storiesOf('react-d3-speedometer', module)
    // Add the `withKnobs` decorator to add knobs support to your stories.
    // You can also configure `withKnobs` as a global decorator.
    .addDecorator(withKnobs)

    .addWithInfo(
        'Configuring values',
        () => {

            const minValue = 0;
            const maxValue = 500;
            const valueOptions = {
                range: true,
                min: minValue,
                max: maxValue,
                step: 10
            };
            const value = number('Value', 287, valueOptions);

            const arcAngleOptions = {
                range: true,
                min: -180,
                max: 180,
                step: 5
            };
            const minAngle = number('Minimum arc angle', -120, arcAngleOptions);
            const maxAngle = number('Maximum arc angle',  90, arcAngleOptions);

            const ringWidth = number('Segment ring width', 3);

            const ringInset  = number('Outer-radius to segment distance', 0);
            const labelInset = number('Outer-radius to value label distance', 58);

            const segments = number('Number of segments', 10);

            const valueCircleRadius = number('Radius of central circle', 30);


            const numTicks1 = number('Number of step 1 ticks', 10);
            const tickLength1 = number('Step 1 tick length', 18);

            const numTicks2 = number('Number of step 2 ticks', 100);
            const tickLength2 = number('Step 2 tick length', 10);

            const numTicks3 = number('Number of step 3 ticks', 20);
            const tickLength3 = number('Step 3 tick length', 14);

            const heatMean = number('Heat center', 287, valueOptions);
            const heatStddev = number('Heat spread', 30);

            const heatfun =
                  (mean, stddev) =>
                  {
                      let f = (x) => {
                          let expNom = -Math.pow(x - mean, 2);
                          let expDen = 2*Math.pow(stddev, 2);
                          let denom  = Math.sqrt(2*Math.PI*Math.pow(stddev, 2));
                          return Math.exp(expNom/expDen)/denom;
                      }
                      return (x) => f(x)/f(mean);
                  };

            const heatFun = heatfun(heatMean, heatStddev);

            const tickSegments =
                [ { numTicks: numTicks1, tickLength: tickLength1 },
                  { numTicks: numTicks2, tickLength: tickLength2 },
                  { numTicks: numTicks3, tickLength: tickLength3 } ];


            return (<ReactSpeedometer
                    maxValue={maxValue}
                    minValue={minValue}
                    value={value}
                    minAngle={minAngle}
                    maxAngle={maxAngle}
                    ringInset={ringInset}
                    labelInset={labelInset}
                    ringWidth={ringWidth}
                    pointerHeadLengthPercent={0.75}
                    valueCircleRadius={valueCircleRadius}
                    needleColor="red"
                    startColor="grey"
                    endColor="grey"
                    segments={segments}
                    tickSegments={tickSegments}
                    textColor="grey"
                    forceRender="true"
                    heatFun={heatFun}
                    />)},
        { source: true, inline: true, header: false }
    )


    // default view with no configuration
    .add('Default with no config', () => (
        <ReactSpeedometer />
    ))

    // fluid display view
    .addWithInfo(
        'Fluid Width view',
        () => (
            <div style={{
                width: "500px",
                height: "300px",
                background: "#EFEFEF"
            }}>
                <ReactSpeedometer
                    fluidWidth={true}
                    minValue={100}
                    maxValue={500}
                    value={473}
                    needleColor="steelblue"
                />
            </div>
        ),
        { source: true, inline: true, header: false }
    )
    // needle transition duration
    .addWithInfo(
        'Needle Transition Duration',
        () => (
            <ReactSpeedometer
                value={333}
                needleColor="steelblue"
                needleTransitionDuration={4000}
                needleTransition="easeElastic"
            />
        ),
        { source: true, inline: true, header: false }
    )
    // knobs for demonstrating force render
    .add('force render the component',
        withInfo({ source: false, text: 'Usage: &lt;ReactSpeedometer forceRender={true} /&gt;', inline: true, header: false })( () => {
            return (
                <SpeedoButton />
            )
        } )
    )
    // configuring format of the value
    .add('Configuring the format for values displayed',
        withInfo({
            source: true,
            text: "converting decimal to integer using 'd' identifier of 'd3 format'. For more details on formatting, please refer - https://github.com/d3/d3-format#locale_format",
            inline: true,
            header: false
        })( () => (
            <ReactSpeedometer
                maxValue={150}
                value={70.7}
                valueFormat={"d"}
            />
        ) )
    )
    // custom value text
    .addWithInfo(
        'Custom Current Value Text',
        () => (
            <ReactSpeedometer
                value={333}
                needleColor="steelblue"
                needleTransitionDuration={4000}
                needleTransition="easeElastic"
                currentValueText="Current Value: ${value}"
            />
        ),
        { source: true, inline: true, header: false }
    )
    ;
