cd=$(ls)
rm README.md
touch README.md
echo "Icon | Name" >> README.md
echo "--- | ---" >> README.md
for entry in $cd
do
  echo "![]($entry) | ${entry/.svg/}" >> README.md
done
