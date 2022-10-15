import { FC } from "react";

import { Table } from "react-bootstrap";

const Lobby: FC = () => (
  <>
    <div>Lobby</div>
    <Table bordered hover id="LobbyContent" size="sm" striped>
      <thead>
        <tr>
          <th>#</th>
          <th>
            Game
            <br />
            leader
          </th>
          <th>Name</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>*</td>
          <td>Otto</td>
          <td>3</td>
        </tr>
        <tr>
          <td>2</td>
          <td />
          <td>Kalle</td>
          <td>0</td>
        </tr>
        <tr>
          <td>3</td>
          <td />
          <td>Pelle</td>
          <td>0</td>
        </tr>
      </tbody>
    </Table>
  </>
);

export default Lobby;
