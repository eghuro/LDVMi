import React, { PropTypes } from 'react'
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import IconMenu from 'material-ui/IconMenu';
import { Link } from 'react-router'
import Icon from '../../../components/Icon'
import IconButton from '../../../components/IconButton'
import MenuItem from '../../../components/MenuItem'
import makePureRender from '../../../misc/makePureRender'
import { Application } from '../../app/models'
import { Visualizer } from '../../core/models'
import * as applicationRoutes from '../../app/applicationRoutes'
import * as configuratorRoutes from '../../app/configuratorRoutes'
import * as theme from '../../../misc/theme'
import withDialogControls from '../../core/containers/withDialogControls'
import ConfirmDialog from '../../core/containers/ConfirmDialog'
import TitleLink from './TitleLink'

const appWrapperStyle = {
  margin: '12px 0'
};

const iconStyle = {
  float: 'left',
  margin: '0.18em 0.6em 0 0'
};

const descriptionStyle = {
  color: '#9e9e9e',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

// Each application has its own delete confirm dialog. It's not exactly nice but it works and is
// simply. We just have to give each dialog a different name.
const confirmDialogName = id => 'DELETE_APP_CONFIRM_DIALOG_' + id;

const ApplicationRow = ({ application, visualizer, deleteApplication, dialogOpen }) => (
  <TableRow>
    <TableRowColumn style={{ width: '60%' }}>
      <div style={appWrapperStyle}>
        <TitleLink to={configuratorRoutes.applicationUrl(application.id)}>
          {visualizer &&
            <Icon icon={visualizer.icon} style={iconStyle} color="#333333" />
          }
          {application.name}
        </TitleLink>
        <div style={descriptionStyle}>
          {application.description}
        </div>
      </div>
    </TableRowColumn>
    <TableRowColumn>
      {visualizer && visualizer.title}
    </TableRowColumn>
    <TableRowColumn style={{ width: '10%' }}>
      {application.published && <Icon icon="done" color={theme.success} />}
    </TableRowColumn>
    <TableRowColumn style={{ width: '10%' }}>
      
      {/* The confirm dialog has to be outside of the IconMenu to work properly. That is why we
          cannot extract the confirm dialog with the delete button into a separate component. */}
      <ConfirmDialog danger
        dialogName={confirmDialogName(application.id)}
        message={`Do you really wish to delete the view "${application.name}"?`}
        action={deleteApplication}
        icon="delete"
      />
      <IconMenu
         iconButtonElement={<IconButton icon="more_vert" />}
         anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
         targetOrigin={{horizontal: 'right', vertical: 'top'}}
         closeOnItemTouchTap={true}
       >
        <Link to={configuratorRoutes.applicationUrl(application.id)}>
          <MenuItem primaryText="Configure" icon="mode_edit" />
        </Link>
        <a href={applicationRoutes.applicationUrl(application)} target="_blank">
          {application.published ?
            <MenuItem primaryText="Open" icon="open_in_browser" /> :
            <MenuItem primaryText="Preview" icon="find_in_page" />}
        </a>
        <MenuItem
          primaryText="Delete"
          icon="delete"
          onTouchTap={() => dialogOpen(confirmDialogName(application.id))}
        />
      </IconMenu>
    </TableRowColumn>
  </TableRow>
);

ApplicationRow.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired,
  deleteApplication: PropTypes.func.isRequired,
  dialogOpen: PropTypes.func.isRequired
};

export default withDialogControls(makePureRender(ApplicationRow));
