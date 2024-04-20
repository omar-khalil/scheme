export type endpoints = {
    get_user: {
        params: {
            user_id: string;
        };
        responses: {
            status: 200;
            data: {
                name: string;
                age: number;
                user_type: "student" | "teacher";
            };
        } | {
            status: 404;
            data: {
                message: string;
            };
        };
    };
    post_user: {
        params: {
            name: string;
            age: number;
            user_type: "student" | "teacher";
        };
        responses: {
            status: 200;
            data: {
                user_id: string;
            };
        };
    };
    delete_user: {
        params: {
            user_id: string;
        };
        responses: {
            status: 200;
            data: {
                message: string;
            };
        };
    };
};