import {describe, it} from 'mocha';
import {data_type, s} from '../src/data_types';
import {expect} from 'chai';
import extract_entries from '../src/helpers/extract_entries';
import {z} from 'zod';
import to_zod from '../src/helpers/to_zod';

type dt<U extends data_type['type'], T> = T extends {type: U} ? T : never;
type specific_data_type<U extends data_type['type']> = dt<U, data_type>;

type datatype_output_test<T extends data_type['type']> = {
  data_type: specific_data_type<T>,
  expected_schema: object,
  example_matching: any,
};

//TODO: remove '?' (aka make all types required)
const tests: {[T in data_type['type']]?: datatype_output_test<T>} = {
  string: {
    data_type: s.str(),
    expected_schema: {type: 'string'},
    example_matching: 'foo',
  },
  number: {
    data_type: s.num(),
    expected_schema: {type: 'number'},
    example_matching: 123,
  },
  boolean: {
    data_type: s.bool(),
    expected_schema: {type: 'boolean'},
    example_matching: false,
  },
  literal: {
    data_type: s.literal('GET'),
    expected_schema: {type: 'literal', value: 'GET'},
    example_matching: 'GET',
  }
}

describe('Datatypes tests', () => {
  extract_entries(tests).forEach(({key, value}) => describe(`${key} datatype`, () => {
    it(`Should return ${value?.expected_schema.toString()}`, () => {
      expect(value?.data_type).deep.equal(value?.expected_schema);
    }),
      it(`Value ${value?.example_matching} should match`, () => {
        try {
          const zod_schema = to_zod(value?.data_type);
          if (zod_schema.safeParse(value?.example_matching)) {
            //mocha succeed?
          } else {
            //mocha fail?
          }
        } catch (error) {
          //mocha manually fail test
        }
      })
  }))
})

describe("Datatype outputs", () => {
  describe('String datatype', () => {
    it('Should return {type: string}', () => {
      const data_type = s.str();
      expect(data_type).deep.equal({type: 'string'});
    });
  });
  describe('Number datatype', () => {
    it('Should return {type: number}', () => {
      const data_type = s.num();
      expect(data_type).deep.equal({type: 'number'});
    })
  });
  describe('Boolean datatype', () => {
    it('Should return {type: boolean}', () => {
      const data_type = s.bool();
      expect(data_type).deep.equal({type: 'boolean'});
    })
  })
});
