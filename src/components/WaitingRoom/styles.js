import { makeStyles } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';
export default makeStyles((theme) => ({
  waitingRoomContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    display: 'flex',
    flexDirection: 'column',
    transform: 'translate(-50%, -50%)',
    backgroundColor: blueGrey[100],
    padding: '25px',
    borderRadius: 5,
    width: '600px',
  },
  listItemText: {
    fontSize: '15px', //Insert your required size
  },
  formControl: {
    width: '100%',
  },
  settingsButton: {
    position: 'absolute',
    right: '5px',
    top: '15px',
  },
  resize: {
    fontSize: 20,
  },
  mediaSources: {
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
  },
  waitingRoomVideoPreview: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px 0px',
  },
  deviceContainer: {
    display: 'flex',
    flexDirection: 'column',
    margin: '10px 5px',
  },
  deviceSettings: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  flex: {
    display: 'flex',
  },
  root: {
    width: '20%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
}));
