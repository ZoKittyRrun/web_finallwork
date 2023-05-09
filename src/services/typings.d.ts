declare namespace API{
  type response<T> ={
    code: number;
    data?: T;
    msg: string;
  }
}
