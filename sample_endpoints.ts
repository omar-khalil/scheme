import {run_server} from "./src/run_server";

run_server({

  get_user: async ({user_id, user_type}) => {
    console.log(`Getting ${user_id} of type ${user_type}`);
    if (user_id === 'error') {
      return {
        status: 404,
        data: {
          message: `${user_id} not found!`
        }
      }
    }
    return {
      status: 200,
      data: {
        name: "name!",
        age: 123,
      }
    };
  },

  post_user: async ({name, age}) => {
    console.log(`Posting ${name} who is ${age} years old`);
    return {
      status: 200,
      data: {
        user_id: "user id!",
      }
    };
  },

  delete_user: async ({user_id}) => {
    console.log(`Deleting ${user_id}`);
    return {
      status: 200,
      data: {
        message: `Successfully deleted ${user_id}`,
      }
    };
  },

});
