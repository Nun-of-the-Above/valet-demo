import styled from "styled-components";

export const SiteWrapper = styled.div`
  display: grid;
  grid-template-rows: 0.5fr 2fr 2fr;
  height: 99.5vh;
  background-color: white;
`;

export const Header = styled.div`
  width: 100%;
  height: 100px;
  max-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeroSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h1`
  /* margin: 0; */
  letter-spacing: 10px;
`;

export const Grid = styled.div`
  display: "grid";
  gridtemplatecolumns: "1fr 1fr";
  padding: "10px";
  margin: "10px";
`;

export const FlexColumn = styled.div`
  display: flex;
  flexdirection: column;
`;
