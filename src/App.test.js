import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import App from './App';

Enzyme.configure( { adapter: new EnzymeAdapter });


/**
  * Factory function to create a ShallowWrapper for the App component
  * @function setup
  * @param {object} props - Component props specific to this setup.
  * @param {any} state - Initial state for setup
  * @returns {ShallowWrapper}
  */
const setup = (props={}, state=null) => {
	const wrapper = shallow(<App {...props} />);
	if (state) wrapper.setState(state);
	return wrapper;
}

/**
  * Return ShallowWrapper containing node(s) with the given data-test value.
  * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper to search within
  * @param {string} val - Value of data-test attribute for search
  * @returns {ShallowWrapper}
  */
const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`)
}

test('renders without any error', () => {
	const wrapper = setup();
    const appComponent = findByTestAttr(wrapper, 'component-app');
    expect(appComponent.length).toBe(1);
})

test('renders increment button', () => {
	const wrapper = setup();
	const incrementButton = findByTestAttr(wrapper, 'increment-button');
	expect(incrementButton.length).toBe(1);
})

test('renders counter display', () => {
	const wrapper = setup();
	const counterDisplay = findByTestAttr(wrapper, 'counter-display');
	expect(counterDisplay.length).toBe(1);
})

test('counter starts at 0', () => {
  const wrapper = setup();
  const initialCounterState = wrapper.state('counter');
  expect(initialCounterState).toBe(0);
})

test('clicking increment button increments counter', () => {
	const counter = 7;
	const wrapper = setup(null, {counter});
  
	// find button and click
	const button = findByTestAttr(wrapper, 'increment-button');
	button.simulate('click');
	  
	// find display and test value
	const counterDisplay = findByTestAttr(wrapper, 'counter-display');
	expect(counterDisplay.text()).toContain(counter + 1);
})

describe('Decrement', () => {
	test('renders decrement button', () => {
		const wrapper = setup();
		const decrementButton = findByTestAttr(wrapper, 'decrement-button');
		expect(decrementButton.length).toBe(1);
	})
	test('clicking decrement button decrements counter when counter is > 0', () => {
		const counter = 9;
		const wrapper = setup(null, {counter});

		// find button and click
		const button = findByTestAttr(wrapper, 'decrement-button');
		button.simulate('click');

		// find display and test value
		const counterDisplay = findByTestAttr(wrapper, 'counter-display');
		expect(counterDisplay.text()).toContain(counter - 1);
	})

	test('clicking decrement button when counter is 0 doesn\'t decrement', () => {
		const counter = 0;
		const wrapper = setup(null, {counter});

		// find button and click
		const button = findByTestAttr(wrapper, 'decrement-button');
		button.simulate('click');

		// find display and test value
		const counterDisplay = findByTestAttr(wrapper, 'counter-display');
		expect(counterDisplay.text()).toContain(0);
	})

	test('error shows', () => {
		const counter = 0;
		const wrapper = setup(null, {counter});

		// find button and click
		const button = findByTestAttr(wrapper, 'decrement-button');
		button.simulate('click');


		// find error and display
		const errorMessage = findByTestAttr(wrapper, 'error-message');
		expect(errorMessage.length).toBe(1);
	})
	test('clicking increment button clears error', () => {
		const counter = 0;
		const wrapper = setup(null, {counter});

		// find button and click
		const button = findByTestAttr(wrapper, 'increment-button');
		button.simulate('click');

		// error doesn't display
		const errorMessage = findByTestAttr(wrapper, 'error-message');
		expect(errorMessage.length).toBe(0);
	})
})




