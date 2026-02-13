import { render, screen, fireEvent } from "@testing-library/react";
import React, { useState } from "react";
import PasswordInput from "./PasswordInput";

const Wrapper = () => {
  const [value, setValue] = useState("");
  return <PasswordInput value={value} onChange={(e) => setValue(e.target.value)} />;
};

test("input changes value when typing", () => {
  render(<Wrapper />);
  const input = screen.getByPlaceholderText("Password");

  fireEvent.change(input, { target: { value: "123456" } });
  expect(input.value).toBe("123456");
});
