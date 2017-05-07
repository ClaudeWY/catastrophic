// Copyright 2017 Oliver Uvman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { test } from 'ava';

import { CatastrophicCaretaker, Catastrophe } from '../';

test(async function basic_use(t) {
  t.plan(0);

  // You would only create one CatastrophicCaretaker, and make it available
  // through your DI system. Any component or module can then use it to define
  // its own errors.
  let error_manager = new CatastrophicCaretaker();

  // To preserve API compat, unique_number must always refer to the same error, forever.
  let tst_errors = {
    tepid_trepidations: {
      unique_number: 0,
      http_code: 500,
      description: `the function couldn't do it due to excessive worry`,
    },
    too_boring_to_compute: {
      unique_number: 1,
      http_code: 400,
      description: `user supplied very boring data`,
    },
  };

  let tst_category = {
    code: 'TST',
    description: 'Testing category',
  };

  // ohno is your error factory for tst_errors, which you could just use within
  // a component or make available in a module through your DI system
  let ohno = error_manager.register_category(tst_category, tst_errors);

  function throwing_inner_function() {
    // This is how you would use it. Typing `ohno.` will
    // trigger auto complete suggestions as appropriate.
    // Fantastic.
    throw ohno.too_boring_to_compute('errordata');
  }

  try {
    throwing_inner_function();
  } catch (e) {
    // e.category == tst_category
    // e.error == tst_errors.too_boring_to_compute
    // e.annotation == 'errordata'
    // e.native_error.stack contains "throwing_inner_function"
    // e.identity() == 'TST_1'
  }
});