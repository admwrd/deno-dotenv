import { readFile, env } from "deno";

interface Variables { [name: string]: any; }

const decoder = new TextDecoder("utf-8");
const LINE_BREAK = /\r\n|\n|\r/;
const ASIGNMENT = /(\w+)\ *\=\ *(.*)/

export default async function dotenv<T extends Variables>(): Promise<T> {
  const environment = env();
  const data = await readFile(".env");
  const content = decoder.decode(data);
  const dotenv = content.split(LINE_BREAK).reduce((variables: T, line: string) => {
    if (!ASIGNMENT.test(line))
      return variables;

    const [_, name, value] = ASIGNMENT.exec(line);
    return { ...variables, [name]: JSON.parse(value) };
  }, {} as T);

  return Object.assign(environment, dotenv);
}
