import {
  GridColumnMenuFilterItem,
  GridColumnMenuHideItem,
} from "@mui/x-data-grid";

const CustomColumnMenu = (props) => {
  return (
    <div style={{ padding: "8px 0" }}>
      <GridColumnMenuFilterItem
        onClick={() => props.hideMenu?.()}
        column={props.currentColumn}
        {...props}
      />
      <GridColumnMenuHideItem
        onClick={() => props.hideMenu?.()}
        column={props.currentColumn}
        {...props}
      />
    </div>
  );
};

export default CustomColumnMenu;
