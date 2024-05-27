import {describe, it} from 'mocha';
import {data_type, s} from '../src/data_types';
import {assert, expect} from 'chai';
import extract_entries from '../src/helpers/extract_entries';
import to_zod from '../src/helpers/to_zod';
import {present} from '../src/helpers/present';

type dt<U extends data_type['type'], T> = T extends {type: U} ? T : never;
type specific_data_type<U extends data_type['type']> = dt<U, data_type>;

type datatype_output_test<T extends data_type['type']> = {
  data_type: specific_data_type<T>,
  expected_schema: object, //using 'object' and 'any' to require the exact expectations from the developer
  example_matching: any,
  example_not_matching?: any, //TODO: extend to support an array of negative and positive examples instead of one each
};

const tests: {[T in data_type['type']]: datatype_output_test<T> | 'unimplemented'} = {
  string: {
    data_type: s.str(),
    expected_schema: {type: 'string'},
    example_matching: 'foo',
  },
  number: {
    data_type: s.num(),
    expected_schema: {type: 'number'},
    example_matching: 123,
    example_not_matching: '123',
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
    example_not_matching: 'POST',
  },
  enum: {
    data_type: s.enum(['student', 'teacher']),
    expected_schema: {type: 'enum', values: ['student', 'teacher']},
    example_matching: 'student',
    example_not_matching: 'admin',
  },
  array: {
    data_type: s.array(s.num()),
    expected_schema: {type: 'array', element_type: {type: 'number'}},
    example_matching: [1, 2, 3],
    example_not_matching: ['1', '2', '3'],
  },
  object: {
    data_type: s.obj({
      property_a: s.num(),
      property_b: s.str(),
    }),
    expected_schema: {type: 'object', properties: {property_a: {type: 'number'}, property_b: {type: 'string'}}},
    example_matching: {property_a: 123, property_b: 'abc'},
  },
  union: {
    data_type: s.union([s.obj({type: s.literal('student'), grade: s.num()}), s.obj({type: s.literal('teacher'), salary: s.num()})]),
    expected_schema: {type: 'union', values: [{type: 'object', properties: {type: {type: 'literal', value: 'student'}, grade: {type: 'number'}}}, {type: 'object', properties: {type: {type: 'literal', value: 'teacher'}, salary: {type: 'number'}}}]},
    example_matching: {type: 'student', grade: 4},
    example_not_matching: {type: 'student', salary: 400},
  },
  //TODO:: tests for s.optional and s.nullable
  undefined: {
    data_type: {type: 'undefined'},
    expected_schema: {type: 'undefined'},
    example_matching: undefined,
    example_not_matching: null,
  },
  null: 'unimplemented',
}

const is_implemented = <T>(entry: {key: data_type['type'], value: 'unimplemented' | T}): entry is {key: data_type['type'], value: T} =>
  entry.value !== 'unimplemented';

const stringify: (value: any) => string = (value) => typeof value === 'object' ? JSON.stringify(value) : value;

describe('Datatypes tests', () => {
  extract_entries(tests).filter(is_implemented).forEach(({key, value}) => describe(`${key} datatype`, () => {
    it(`Should return ${JSON.stringify(value.expected_schema)}`, () => {
      expect(value.data_type).deep.equal(value.expected_schema);
    });

    it(`Value ${stringify(value.example_matching)} should match`, () => {
      const zod_schema = to_zod(value.data_type);
      const type_matches = zod_schema.safeParse(value.example_matching).success;
      if (type_matches) {
        assert(true, 'Example value can be parsed');
      } else {
        assert(false, 'Example value cannot be parsed');
      }
    })

    if (present(value.example_not_matching)) {
      it(`Value ${stringify(value.example_not_matching)} should not match`, () => {
        const zod_schema = to_zod(value.data_type);
        const type_matches = zod_schema.safeParse(value.example_not_matching).success;
        if (type_matches) {
          assert(false, 'Example value matched, but should not');
        } else {
          assert(true, 'Example successfully did not match');
        }
      })
    }

  }))
})
