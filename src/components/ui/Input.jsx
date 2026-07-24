function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label>{label}</label>

      <br />

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: "250px",
          padding: "10px",
          marginTop: "5px",
        }}
      />
    </div>
  );
}

export default Input;