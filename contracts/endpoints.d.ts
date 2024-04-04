type endpoints = {
    get_user: {
        params: {
            user_id: string;
            user_type: "student" | "teacher";
        };
    };
    post_user: {
        params: {
            name: string;
            age: number;
        };
    };
    delete_user: {
        params: {
            user_id: string;
        };
    };
};