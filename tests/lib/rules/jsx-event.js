/**
 * @fileoverview Fix problem with jsx eventa
 * @author Artyom
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-event')

var RuleTester = require('../../../lib/testers/rule-tester')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester()
ruleTester.run('jsx-event', rule, {

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
