async function main() {
  const [deployer] = await ethers.getSigners();

  const IDO = await ethers.getContractFactory("IDO");
  const ido = await IDO.deploy();
  console.log("Token address:", ido.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
