/**
 * @fileoverview JSX exceptions
 * @author Artyom
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/1')

var RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester()
ruleTester.run('1', rule, {

  valid: [

    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: 'vOn:click_prevent={this.toggle}',
      errors: [{
        message: 'Fill me in.',
        type: 'Me too'
      }]
    }
  ]
})
