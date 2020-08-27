# Click counter

The purpose of this project is to practice testing with **Jest** and **Enzyme**, as well as TDD[^1] principles by seting up a simple React app with Jest and Enzyme. We use:

- Enzyme's `shallow()` function is used to render a component. 
- `find()` to test that required DOM elements are rendered
- `setState()` and `state()` to test state
- `simulate` to interact with rendered elements (clicked button)
-  `data-test` attributes to test the rendering of components.

> 🔴 **RED - 🟢 GREEN TDD method**
>
> First I write the tests, so that they fail (**red**) and then I write the actual code so that the tests pass (**green**).



## Index

1. [The app](#1.-The-app)
2. [Initial set up](#2.-Set-up)
   1. [Installing Enzyme](#Installing-Enzyme)
   2. [Configuring Enzyme](#Configuring-Enzyme)
3. [Writing the tests](#3.-Writing-the-tests)
   1. [Structure](#Structure-of-tests-that-we'll-need)
   2. [Test Component Rendering](#Test-Component-Rendering)
   3. [DRY Refactor](#DRY-Refactor)
   4. [Testing Initial State](#Testing-Initial-State)
4. [Shallow functions](#4. shallow rendering functions used)



## 1. The app

I'm testing a simple React app that displays a counter and a button. Each time the user clicks on the button, the counter increments by one.

  ![click-counter-show](/Users/elenamartinezmarin/Documents/web-development/repositories/practice/click-counter/click-counter-show.gif)

## 2. Set up

### Installing Enzyme

`create-react-app` doesn't come with Enzyme, so we need to install it through 3 packages:

- `enzyme`
- `enzyme-jest`
- `enzyme-adapter-react-16` (for v16 of React) [^2]

```bash
npm install --save-dev enzyme jest-enzyme enzyme-adapter-react-16
```

> ℹ️  We save these packages for **development**, we don't need them for production. 



### Configuring Enzyme

we import the packages:

```js
import Enzyme, {shallow} from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
```

> We need to import:
>
> - enzyme and shallow[^2]
> - the adapter for enzyme

We configure the adapter:

```js
Enzyme.configure({ adapter: new EnzymeAdapter() })
```

> This lets Enzyme know that we are going to use **React 16**.



## 3. Writing the tests

### Structure of tests that we'll need

We start by writing the **basic test** for any Component of **rendering without any error**:

```jsx
test('renders without error', () => {
  // code will go here
})
```

**Test that there is the button**:

```jsx
test('renders increment button', () => {
  // code will go here
})
```

**Test that we have a display of the counter**:

```jsx
test('renders counter display', () => {
  // code will go here
})
```

**Test that the counter starts at 0** (we are going to test state)

```jsx
test('counter starts at 0', () => {
  // code will go here
})
```

**Test that when the button is clicked, it increments the counter display**

```jsx
test('clicking button increments counter', () => {
  // code will go here
})
```



#### Test Component Rendering

We can try the `data-test` attribute method where we add such an attribute to the component.

> ❓ **Why would we want to add a `data-test` attribute?**
>
> We could use the `id` or the `class` but these attributes have their own uses within the app and might be changed by another programmer 👉🏻 `data-test` is only for test purposes.

> ⚠️ Here we call it `data-test` but it could have any name that you choose (`test-id`, etc.)

> ℹ️ **Naming convention for any data test values:** `component-NameOfComponent` 👉🏻 in our case: `component-app`

> 👉🏻 **we can remove these data-test attributes for production** with the `babel-plugin-react-remove-properties` package.

**App.test.js**

```jsx
test('renders without error', () => {
  const wrapper = shallow(<App />);
  const appComponent = wrapper.find("[data-test='component-app']")
  expect(appComponent.length).toBe(1); // we expect to find 1 element with data-test="component-app"
})
```

> 👉🏻 **`shallow`** takes **jsx**.

>  🔴 'renders without error' should fail



**App.js**

```jsx
class App extends Component {
  render() {
    return (
    	<div data-test="component-app">
      </div>)
  }
}
```

>  🟢 All tests should pass!



**We do the same for the rest of the tests** 

But we look for different `data-test` attribute values.

**App.test.js**

```jsx
test('renders increment button', () => {
  const wrapper = shallow(<App />);
  const incrementButton = wrapper.find("[data-test='increment-btn']")
  expect(incrementButton.length).toBe(1); 
})

test('renders counter display', () => {
  const wrapper = shallow(<App />);
  const counterDisplay = wrapper.find("[data-test='counter-display']")
  expect(appComponent.length).toBe(1); 
})

test('counter starts at 0', () => {
	// code will go here
})

test('clicking button increments counter', () => {
	// code will go here
})
```

>  🔴 'renders counter display' & 'renders increment button' should fail

**App.js**

```jsx
class App extends Component {
  render() {
    return (
    	<div data-test="component-app">
        <h1 data-test="counter-display">The coutner is currently</h1>
        <button data-test="increment-button">Increment counter</button>
      </div>)
  }
}
```

> 🟢 All tests should pass!



---

#### DRY Refactor

I'll refactor my code so it's not so repetitive:

1. we create a **set up function** that renders the **shallow**[^3] version of our component and allows us to give it optional props and state.

   ```jsx
   const setup = (props={}, state=null) => {
     const wrapper = shallow(<App {...props} />);
     if (state) wrapper.setState(state);
     return wrapper;
   }
   ```

2. 👉🏻 we substitute each "`const wrapper = shallow(<App />)`" for `	const wrapper = setup()`.

3. we create a function that finds our data-test attributes

   ```jsx
   const findByTestAttr = (wrapper, val) => {
     return wrapper.find(`[data-test="${val}"]`)
   }
   ```

4. 👉🏻 we substitute each "`  const counterDisplay = wrapper.find("[data-test='counter-display']")`" with our `findByTestAttr` function.



---

#### Testing Initial State

1. Create a shallow wrapper
2. See what the state is for the counter
3. See if it is `0`

**App.tes.js**

```jsx
test('counter starts at 0', () => {
  const wrapper = setup();
  const initialCounterState = wrapper.state('counter');
  expect(initialCounterState).toBe(0);
})
```

>  🔴 'counter starts at 0' should fail

**App.js**

```jsx
class App extends Component {
  constructor(props) {
    super(props);
    
    this.state {
      counter: 0
    }
  }

  render() {
      return (
        <div data-test="component-app">
          <h1 data-test="counter-display">The coutner is currently</h1>
          <button data-test="increment-button">Increment counter</button>
        </div>);
  }
}
```

> 🟢 all tests should pass!



#### Test Button click (update state)

1. set initial state
2. find button
3. simulate click event on the button
4. find the display
5. test that the number in the display matches the number we expect

**App.test.js**

```jsx
test('clicking button increments counter display', () => {
	const counter = 7;
  const wrapper = setup(null, { counter });
  
  // find button and click
	const button = findByTestAttr(wrapper, 'increment-button');
  button.simulate('click');
  
  // find display and test value
  const counterDisplay = findByTestAttr(wrapper, 'counter-display');
  expect(counterDisplay.text()).toContain(counter + 1);
  
})
```

>  🔴 'clicking button increments counter display' should fail

**App.js**

```jsx
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0
    }
  }

  render() {
      return (
        <div data-test="component-app">
          <h1 data-test="counter-display">The coutner is currently {this.state.counter}</h1>
          <button 
            data-test="increment-button">
            onClick={() => this.setState({counter: this.state.counter + 1})}
            Increment counter
          </button>
        </div>);
  }
}
```



> 🟢 'all tests should pass!'



## 4. Shallow rendering functions used

**`.shallow([options])`**: Renders the root node and returns a shallow wrapper around it. It must be a single-node wrapper. [Reference](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/shallow.html)

**`.find(selector)`**: Finds every node in the render tree of the current wrapper that matches the provided selector. The selectors are valid CSS selectors. [Reference](https://enzymejs.github.io/enzyme/docs/api/selector.html)

**`.text()`**: Returns a string of the rendered text of the current render tree. [Reference](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/text.html)

**`.simulate(event)`**: Simulates events on the root node in the wrapper. [Reference](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/simulate.html) 

**`.state([key])`**: Returns the state hash for the root node of the wrapper.  Optionally pass in a prop name and it will return just that value. [Reference](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/state.html)

**`.setState(nextState)`**: Invokes `setState()` on the root component instance. [Reference](https://enzymejs.github.io/enzyme/docs/api/ShallowWrapper/setState.html)





----

[^1]: **Test Driven Development**: Write the tests before the code. Red-green testing.
[^2]: **`enzyme-adapter-X`** tells enzyme what kind of code we are going to be writing, in this case, we are using React v.16.*
[^3]: **shallow rendering** is a special kind of rendering that Enzyme allows us to use, which consists on rendering only one level depth of a component. The component will render but the children components won't be rendered, instead, there will be a placeholder. This method allows for quicker, cleaner and more isolated tests. 👍🏻
