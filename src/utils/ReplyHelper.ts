type reply = {
  ok: boolean;
  data: any;
  message?: string;
};

const replyOk = (data?: any) => {
  return { ok: true, data: data };
};

const replyErr = (err: Error) => {
  return { ok: false, data: err.name, message: err.message };
};

export { reply, replyOk, replyErr };
