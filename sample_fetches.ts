import {fetchers} from "./src/create_fetchers";

const run_fetch = async () => {
  const post_result = await fetchers.post_user({name: "Omar", age: 300});
  console.log(post_result);

  const get_result = await fetchers.get_user({user_id: 'omar', user_type: 'student'});
  console.log(get_result);
};

run_fetch();
