
export const ErrorMsg = <T extends object>(rx: { touched: boolean; error?: string; }) => {
  if (rx.touched && rx.error)
    return <div>{rx.error}</div>;
  return <> </>;
};
