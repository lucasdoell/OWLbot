module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  async redirects() {
    return [
      {
        source: "/invite",
        destination:
          "https://discord.com/api/oauth2/authorize?client_id=1088622741558669383&permissions=2147485696&scope=bot%20applications.commands",
        permanent: true,
      },
    ];
  },
};
