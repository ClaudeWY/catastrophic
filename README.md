# catastrophic

Auto completion and dependency injection friendly library for
constructing modular unique permanent error codes.

This library is intended for use in back ends which should not reveal
internal state through errors, and which have separate front ends
responsible for translating and presenting intelligible errors.

```typescript
// Terse example

let error_manager = new Catastrophic();

let ohno = error_manager.new_category({
  unique_code: 'E',
  description: 'Example category',
  // default_http_code: 400,
  // We could specify a default http code for all the errors in this
  // category if we wanted to. This is 500 unspecified.
}, {
  something_not_on_the_up_and_up: {
    unique_number: 0,
    description: `the owls are not what they seem`,
  },
  too_boring_to_compute: {
    unique_number: 1,
    http_code: 400, // << Would've defaulted to 500 if we didn't specify it
    // description: 'too_boring_to_compute',  << Defaults to key if not set
  },
});

// Typing ohno. will trigger auto complete suggestions as appropriate.
// ohno's type is ErrorCat<typeof tst_errors>. Fantastic.

throw ohno.too_boring_to_compute('the most boring datums');

// You can also wrap existing errors

try {
  throw new Error(`it's all bent sideways your majesty`);
} catch (e) {
  throw ohno.something_not_on_the_up_and_up(e);
}

// Annotations can be anything, and they can be used while wrapping
// existing Errors as well

let catastrophe = ohno.something_not_on_the_up_and_up(new Error('carp'), {
  what_is_going_on: 'fishy',
  in_this_hotel_anyway: 'business',
  fishiness: 0.99,
});

// In your error handling middleware, you can just re-throw the Catastrophe
// if you are in debug mode, or else get the unique error identifier:

catastrophe.identity(); // -> 'E_0'
catastrophe.identity_json(); // {error_category: 'E', error_number: 0}

// We can call a function to get a structure containing all registered
// error categories and their registered errors, with computed values
// from any defaults. Useful for generating docs for your client side
// devs.
let cats_and_errors_json = error_manager.get_summary_json();
```

Each error (`Catastrophe`) is a part of a Category. Each Category has a:
* Permanent and unique Category Code (a string)
* Description

Each Catastrophe has:
* A permanent Number, which is only unique within each category
* A description
* An associated HTTP Status Code

When you create a Catastrophe, you can annotate it with some arbitrary
data. You can wrap an `instanceof Error`. If you don't, a native JS `new
Error('catastrophic')` object is used. A stack trace from one of these
is accessible.

You use a builder pattern (-ish) to construct error categories with
errors, and receive one factory object per category, which lets you
construct Catastrophes for throwing. TypeScript provides auto completion
for these factories. These factories are called `ErrorCat`s. Idiomatic
ErrorCats are named `ohno`.

Any property in this library that is described as permanent or unique is
used to construct error identifiers for public consumption. They should
remain unique and permanent. Other properties are only intended for use
in debug logs.

Permanent/unique properties should never be changed once they have been
defined. They are defined explicitly by developers using this library,
not implicitly, to avoid any unexpected changes. The library ensures
that there are no collisions between unique identifiers.

# Example

Look in [src/test/docs.test.ts](src/test/docs.test.ts)

# Details

* Requires TypeScript 2.1 or higher (uses `keyof`)
* Tested on Node 7.9.0, with TS 2.3.2 (2017-05-08) (0e09712)
* Tested on Node 7.9.0, with TS 2.1.5 (2017-05-07) (c76f427)
* See LICENSE file for license (Apache 2.0. You may also ask
  Oliver Uvman for a GPLv2 compatible license.)
* See CONTRIBUTING for contributor's agreement (You grant Apache 2.0
  and you allow Oliver Uvman to redistribute under any GPLv2 compatible
  license)
