export function capitalizeFirstLetter(string: string) {
  const words = string.split("-");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(" ");
}

export function getFullName(name: string, surname: string) {
  return `${name} ${surname}`;
}

export function getFromLocalStorage(key: string = "userData") {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return null;
}

export function setToLocalStorage(key: string = "userData", value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeFromLocalStorage(key: string) {
  localStorage.removeItem(key);
}

export function getAuthToken() {
  const userData = getFromLocalStorage();
  return userData.token;
}

export function isHR() {
  const user = getFromLocalStorage("userData");
  return user?.role === "hr";
}

export function isCEO() {
  const user = getFromLocalStorage("userData");
  return user?.role === "ceo";
}

export function isEmployee() {
  const user = getFromLocalStorage("userData");
  return user?.role === "employee";
}

//? Future ilvi you will need to remember where you got this code from
//?https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
function hashCode(str: string | undefined) {
  if (!str) {
    return 0;
  }

  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function stringToHashCodeHelper(str: string) {
  return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
}
