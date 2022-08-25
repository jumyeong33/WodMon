const replyOk = (data?: any) => {
  return { ok: true, data: data };
};

const replyErr = (err: Error) => {
  return { ok: false, data: err.name, message: err.message };
};

export { replyOk, replyErr };
