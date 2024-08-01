import React from 'react';
import useFetchCategories from '../../utils/useFetchCategories';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    button: {
        margin: theme.spacing(1),
    },
}));

function CategoryMenu() {
    const classes = useStyles();
    const [state, dispatch] = useStoreContext();
    const { loadingCat, categories } = useFetchCategories();

    const handleClick = (id) => {
        dispatch({
            type: UPDATE_CURRENT_CATEGORY,
            currentCategory: id,
        });
    };

    if (loadingCat) return <CircularProgress />;

    return (
        <div className={classes.container}>
            <div>
                {categories.map((item) => (
                    <Button
                        key={item._id}
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={() => { handleClick(item._id); }}
                    >
                        {item.name}
                    </Button>
                ))}
                <Button variant="contained" color="secondary" className={classes.button}
                    onClick={() => { handleClick(''); }}
                >
                    All
                </Button>
            </div>
        </div>
    );
}

export default CategoryMenu;