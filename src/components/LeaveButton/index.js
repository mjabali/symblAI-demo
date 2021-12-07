// import OtherControl from '../OtherControl';
import IconPath from '@vonagevolta/volta2/dist/symbol/volta-icons.svg';
function LeaveButton() {
  function handleClick() {
    window.location.replace('/thank-you');
  }

  return (
    <div className={`Vlt-btn Vlt-btn--tertiary Vlt-btn--app other`}>
      <svg className={`Vlt-icon Vlt-icon--small Vlt-purple`}>
        <use xlinkHref={`${IconPath}#Vlt-icon-phone-down-full`} />
      </svg>
      <br />
      Leave
    </div>
    // <OtherControl
    //   iconName="Vlt-icon-phone-down-full"
    //   iconColor="red"
    //   title="Leave Meeting"
    //   onClick={handleClick}
    // />
  );
}

export default LeaveButton;
