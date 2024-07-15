import axios from "axios";

const fetchUserData = async (currentUser) => {
    try {
        const res = await axios.get(`/users/${currentUser.id}`);
        currentUser(res.data);
    } catch (err) {
        console.log(err);
    }
};

export { fetchUserData }