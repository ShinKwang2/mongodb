console.log("client code running.");
const axios = require("axios");

const URI = "http://localhost:3000";

// 비효율적인 방법:
//      - blogsLimit 20일 때: 6초 초반
// populate 사용하는 방법
//      - blogLimit 20일 때: 0.4초 이하
// 문서 내장 사용하는 방법
//      - blogLimit 20일 때: 0.04초

const test = async () => {
    console.time("loading time: ");
    let { 
        data: { blogs },
    } = await axios.get(`${URI}/blog`);
    // console.dir(blogs, {depth: 10});

    // blogs = await Promise.all(blogs.map(async blog => {

    //     const [res1, res2] = await Promise.all([
    //         axios.get(`${URI}/user/${blog.user}`),
    //         axios.get(`${URI}/blog/${blog._id}/comments`)
    //     ]);
    //     blog.user = res1.data.user;
    //     blog.comments = await Promise.all(
    //       res2.data.comments.map(async (comment) => {
    //         const {
    //             data: { user }
    //         } = await axios.get(`${URI}/user/${comment.user}`);
    //         comment.user = user;
    //         return comment;
    //       })  
    //     );        
    //     return blog;
    // }));
    console.timeEnd("loading time: ");
};

// test();

const testGroup = async () => {
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
}

testGroup();