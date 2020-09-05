module.exports = async function ({ axios }) {
  const result = await axios.get("https://jsonplaceholder.typicode.com/posts");
  return {
    items: result.data,
  };
};
