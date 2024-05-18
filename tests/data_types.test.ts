import {describe, it} from 'mocha';
import {s} from '../src/data_types';
import {expect} from 'chai';

describe("Testing the string datatype", () => {
  it('Should return {type: string}', () => {
    const data_type = s.str();
    expect(data_type).deep.equal({type: 'string'});
    // assert.equal(data_type, {type: 'string'});
  })
})
