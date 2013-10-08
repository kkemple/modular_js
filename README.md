# ModJS

ModJS is a javascript framework that utilizes the Module, Factory, and Mediator patterns to be a base for projects that allows for the quick integration of complex, scalable, and application level javascript without starting from scratch. There are four tiers to the framework which allows for better seperation of code and a more scalable architecture. The four levels are:

- **Base**: This layer is currently jQuery, but it could be replaced by any JS library used for cross-browser normalization and utility functions. However it is very important to know that the only other layer that has access to the Base layer is the Core layer. This allows for easy decoupling of the Base layer, making it interchangable and the framework itself more versitile and reusable.
- **Core**: This layer is the actual core of the framework. It contains all utitity functions such as dom functions, and assistive functions such as array checks, mapping, and any other functions that are used to assist in faster development of JS. It is the only layer that can communicate with the Base layer, and it also works with the Sandbox layer.
- **Sandbox**: This layer is responsible for all communication between a Module and the Core. It's only job is to pass along data and send out notifications to the rest of the modules and inform the Core layer of any work that needs to be done.
- **Module**: This layer is responsible for small sections of the application that are independent pieces of functionality. An example would be Twitter. The tweets feed is one module, search is another module, and posting a tweet is another module. All other modules should be independent of each other and the addition or removal of a module should have no affect on any other part of the application (site).

## So what does this framework really accomplish?
The point of ModJS is force developers into creating reusable fully modular code that will allow a higher reusability rate with JS. It will all be written the same way eliminating consistancy issues and it will be fully adaptable to any development environment making it future-proof in regard to back-end framework changes.

## How does it work as a whole?
By decoupling all the layers of the application you can drop in an entire base and some modules from previous projects and with minor updates you could potentially decrease development time by a large amount. It will also help developers adopt the latest application development methods and best practices.

## Contributing
If you would like to contribute to this project:

- Clone the repo
- Create new feature or issue branch with name of task or recommended change
- Make changes
- Push new branch to origin
- Add a new merge request with a detailed explaination of the changes you made

Once the changes are reviewed they will either be added or the merge request will be closed.


## Code Best Practices and Standards


### All functions must be commented in detail

This should include any parameters passed in, what the function does, and what it returns. Here is an example of a commented utility function:

```javascript
/**
 * @description       check to see if object is an array
 * @param  {unknown}  arr
 * @return {Boolean}  true or false
 * @method          is_array
 * @private
 */
MOD.core.util.is_array = function( arr ) {
   return ( typeof arr === 'object' && ( Object.toString.call( arr ) === '[object Array]' ) ) ? true : false;
};
```


### All statements must be properly terminated
**NOT OKAY**:

```javascript
var employee = new Person({
    name: 'John Doe',
    age: 27,
	occupation: 'Developer'
})

greetEmployee( employee.name )
```

**OKAY**:

```javascript
var employee = new Person({
	name: 'John Doe',
	age: 27,
	occupation: 'Developer'
});

greetEmployee( employee.name );
```
> Notice the semi-colons at the end of each statement

**ALSO OKAY**:

```javascript
var employee = new Person({
			name: 'John Doe',
			age: 27,
			occupation: 'Developer'
		}),
	greetEmployee;

greetEmployee = function( name ) {
	alert( 'Hello, ' + name + '! Glad to have you on board!' );
};

greetEmployee( employee.name );
```

### Spacing and Indentation

When your code gets too long to easily read it should be broken on to a new line and double indented so it can be easily recongnized as an extension of the previous line. Example:

```javascript
// final code may not include a modify function, strictly for demonstration purposes
var mod = Core.create_module( 'wp_search_results', {})
mod.query( '.some-inner-element' ).modify( 'class' , 'remove', 'active')
        .modify( 'text', 'Some new text' );
```

Function parameters should be spaced at the beginning and end, and after commas. Example:

```javascript
function useSpaces( param1, param2 ) {
    window.console.log( 'I use spaces in my paramters for visual cleanliness.' );
}

useSpaces( param1, param2 );
```

When writing functions it is important to group similar items and to use proper indentation. Every inner operation should indent one more tab set than its parent element. Variables should be grouped together and different operations should have a line of space around them. Example:

```javascript
var i = 0,
    items = mod.query( '.inner-items' ),
    len = items.length;

for ( ; i < len; ) {

    //add a class to each item
    item.modify( 'class', 'add', 'new-class' );

    // increment our counter
    ++i;
}
```



