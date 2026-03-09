  <!-- 1 Number question answer -->
   - `var` is function‑scoped, can be redeclared and updated, and is hoisted with an initial value of `undefined`.  
   - `let` is block‑scoped, can be updated but not redeclared in the same scope, and is hoisted but not initialized (Temporal Dead Zone).  
   - `const` is block‑scoped, cannot be updated or redeclared, and must be initialized at declaration. It also creates an immutable binding (but object properties can still be mutated).

<!-- 2 Number answer added -->
   The spread operator expands iterables (like arrays, strings, or objects) into individual elements. It is commonly used to copy arrays/objects, merge them, or pass elements as function arguments.

3. **What is the difference between map(), filter(), and forEach()?**  
   - `map()` creates a **new array** by applying a function to each element.  
   - `filter()` creates a **new array** with elements that pass a test.  
   - `forEach()` executes a function on each element but **does not return a new array** (used for side effects).

4. **What is an arrow function?**  
   Arrow functions provide a shorter syntax: `(params) => expression`. They do not have their own `this`, `arguments`, `super`, or `new.target`, and are not suitable as methods or constructors.

5. **What are template literals?**  
   Template literals are string literals enclosed by backticks (\`) instead of quotes. They support multi‑line strings and embedded expressions using `${expression}`.